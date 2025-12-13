# 颜色系统集成文档

## 概述

已将您的颜色系统完整集成到 Ant Design 主题配置中。

## 文件结构

```
src/theme/
├── colors.ts      # 颜色定义和 CSS 变量
├── index.ts       # Ant Design 主题配置
└── export.ts      # 统一导出
```

## 使用方法

### 1. 在 React 组件中使用颜色

```typescript
import { colors } from '@/theme/colors';

// 在 style 中使用
<div style={{ color: colors.primary, backgroundColor: colors.lightGray }}>
  内容
</div>
```

### 2. 在 CSS/SCSS 中使用 CSS 变量

```css
.custom-element {
  color: var(--color-primary);
  background-color: var(--color-lightgray);
  border: 1px solid var(--color-border);
}

.custom-button {
  background: var(--color-primary);
  color: var(--color-white);
}

.custom-button:hover {
  background: var(--color-primary-emphasis);
}
```

### 3. 在 Tailwind CSS 中使用

可以扩展 Tailwind 配置来使用这些颜色：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        // ... 其他颜色
      }
    }
  }
}
```

然后在 HTML 中使用：

```html
<div class="bg-primary text-white">主要按钮</div>
<div class="text-success">成功消息</div>
```

## 颜色映射表

### 主色调
- `colorPrimary`: #635BFF (紫色)
- `colorSecondary`: #16CDC7 (青色)

### 状态颜色
- `colorSuccess`: #36c96c (成功/绿色)
- `colorWarning`: #f8c20a (警告/黄色)
- `colorError`: #FF6692 (错误/红色)
- `colorInfo`: #46CAEB (信息/蓝色)

### 文本颜色
- `colorText`: #1F2A3D (主文本)
- `colorTextSecondary`: #98A4AE (次要文本)

### 边框颜色
- `colorBorder`: #e0e6eb (主边框)
- `colorBorderSecondary`: #f3f3f4 (次要边框)

### 背景颜色
- `colorBgContainer`: #ffffff (容器背景)
- `colorBgLayout`: #F4F7FB (布局背景)
- `colorBgSpotlight`: #EFF4FA (高光背景)

## 组件主题定制

所有 Ant Design 组件都已应用您的颜色系统：

- ✅ Button - 按钮
- ✅ Layout - 布局
- ✅ Menu - 菜单
- ✅ Card - 卡片
- ✅ Input - 输入框
- ✅ Select - 选择器
- ✅ Table - 表格
- ✅ Modal - 模态框
- ✅ Message - 消息提示
- ✅ Tag - 标签
- ✅ Badge - 徽标
- ✅ Alert - 警告提示
- ✅ Pagination - 分页
- ✅ Switch - 开关
- ✅ Progress - 进度条

## 示例代码

### Button 示例

```tsx
import { Button } from 'antd';

// 主要按钮 - 使用 primary 颜色
<Button type="primary">主要按钮</Button>

// 成功按钮
<Button type="primary" danger={false} style={{ backgroundColor: 'var(--color-success)' }}>
  成功按钮
</Button>

// 警告按钮
<Button type="primary" style={{ backgroundColor: 'var(--color-warning)' }}>
  警告按钮
</Button>
```

### Alert 示例

```tsx
import { Alert } from 'antd';

// 自动使用配置的颜色
<Alert message="成功提示" type="success" />
<Alert message="警告提示" type="warning" />
<Alert message="错误提示" type="error" />
<Alert message="信息提示" type="info" />
```

### Tag 示例

```tsx
import { Tag } from 'antd';

<Tag color="success">成功标签</Tag>
<Tag color="warning">警告标签</Tag>
<Tag color="error">错误标签</Tag>
<Tag color="processing">处理中</Tag>
```

## 自定义组件使用颜色

```tsx
import { colors } from '@/theme/colors';

const CustomCard = () => {
  return (
    <div 
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        padding: '16px',
        color: colors.dark,
      }}
    >
      <h3 style={{ color: colors.primary }}>标题</h3>
      <p style={{ color: colors.bodyText }}>内容文本</p>
    </div>
  );
};
```

## 注意事项

1. **优先使用 Ant Design 组件**：Ant Design 组件会自动应用主题配置
2. **CSS 变量可全局访问**：在任何 CSS/SCSS 文件中都可以使用 `var(--color-xxx)`
3. **TypeScript 支持**：`colors` 对象有完整的类型定义
4. **保持一致性**：尽量使用统一的颜色变量，避免硬编码颜色值

## 扩展主题

如需进一步定制主题，可以修改 `src/theme/index.ts` 文件：

```typescript
export const themeConfig: ThemeConfig = {
  token: {
    // 在这里添加或修改 token
  },
  components: {
    // 在这里添加或修改组件配置
    YourComponent: {
      // 组件特定配置
    }
  }
};
```

