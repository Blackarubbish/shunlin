---
title: React的受控与非受控组件
slug: react-controllable-value
category: 'programming'
publishDate: '2025-8-3'
tags: ['前端', 'React']
featured: true
coverImage: /icons/React.svg
cardCoverClassName: object-contain
articleCoverClassname: object-contain
---

## 受控与非受控
- 受控，组件或者dom的value受到外部的state控制，由代码来控制它的value的变化

好处是组件的value完全由代码来控制，最灵活。然而由于React的组件渲染机制，state的改变还会触发组件的重新渲染，影响性能

```tsx
function App() {
  const [value, setValue] = useState("");

  return (
    <>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        />
    </>
  );
}

```



- 非受控，由组件或者dom自己维护自己的value，需要的时候再取出来

value交由组件或者dom节点自己维护，需要的时候再取出来用，即减少了定义state，自己处理state的复杂度，也能再一定程度上减少组件的频繁渲染

```tsx
function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        onChange={(e) => {
          console.log("e.value", e.target.value);
          // setValue(e.target.value);
        }}
      />
    </>
  );
}

export default App;
```



然而事实上受控与非受控不是孰好孰坏的排斥关系，而是需要根据实际场景选择是否完全控制这个组件。因此在很多自己封装的组件中，props往往会有三个值

```tsx
interface Props {
  value?: Value;
  defaultValue?: Value;
  onChange?: (value: Value) => void;
}
```

当value不传入的时候，组件自己维护内部的state（非受控）反正为受控组件。这个逻辑在组件内部依靠对value是否为`undefined`来判断。







## 例子： Conter组件
这个例子中的重点就是判断propsValue是否`undefined`,  根据这个条件来选择使用哪个value

```tsx
interface CounterProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

function Counter(props: CounterProps) {
  const { value: propsValue, defaultValue, onChange } = props;
  const isFirstRender = useRef(true);

  const DEFAULT_FALUE = 0;

  const [value, setValue] = useState<number>(() => {
    if (propsValue !== undefined) {
      return propsValue;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return DEFAULT_FALUE;
  });

  useEffect(() => {
    // 受控组件切换到非受控时做处理，将value充值为undefined
    if (propsValue === undefined && !isFirstRender.current) {
      setValue(propsValue!);
    }
    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? value : propsValue;

  const onAdd = () => {
    const updatedValue = mergedValue + 1;
    if (propsValue === undefined) {
      setValue(updatedValue);
    }
    onChange?.(updatedValue);
  };

  const onSubtract = () => {
    const updatedValue = mergedValue - 1;
    if (propsValue === undefined) {
      setValue(updatedValue);
    }
    onChange?.(updatedValue);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
      }}
    >
      <button onClick={onAdd}>+</button>
      <div>{mergedValue}</div>
      <button onClick={onSubtract}>-</button>
    </div>
  );
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(1);
  return (
    <>
      <Counter
        defaultValue={123}
        value={count}
        onChange={(c) => {
          console.log("change", c);
          setCount(c);
        }}
      />
    </>
  );
}

export default App;

```



## Hook封装
更近一步，可以封装出一个支持受控与非受控的hook

(下面代码摘自[ 掘金React通关秘籍](https://juejin.cn/book/7294082310658326565) ）

```tsx
function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T,
    value?: T,
    onChange?: (value: T) => void;
  },
): [T, React.Dispatch<React.SetStateAction<T>>,] {
  const { defaultValue, value: propsValue, onChange } = props || {};

  const isFirstRender = useRef(true);

  const [stateValue, setStateValue] = useState<T>(() => {
    if (propsValue !== undefined) {
      return propsValue!;
    } else if(defaultValue !== undefined){
      return defaultValue!;
    } else {
      return defaultStateValue;
    }
  });

  useEffect(() => {
    if(propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!);
    }

    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? stateValue : propsValue;

  function isFunction(value: unknown): value is Function {
    return typeof value === 'function';
  } 

  const setState = useCallback((value: SetStateAction<T>) => {
    let res = isFunction(value) ? value(stateValue) : value

    if (propsValue === undefined) {
      setStateValue(res);
    }
    onChange?.(res);
  }, [stateValue]);

  return [mergedValue, setState]
}
```



也可以直接使用ahook封装好的[hook](https://ahooks.js.org/zh-CN/hooks/use-controllable-value)`useControllableValue`

