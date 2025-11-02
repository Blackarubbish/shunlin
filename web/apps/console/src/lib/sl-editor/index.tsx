import MDEditor from "@uiw/react-md-editor";
import "./styles/index.css";
import { FileImageOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface SLEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

export const SLEditor = ({ value, onChange, height = 800 }: SLEditorProps) => {
  return (
    <MDEditor
      value={value}
      preview="edit"
      onChange={(newValue) => onChange(newValue || "")}
      height={height}
      components={{
        toolbar: (command, disabled, executeCommand) => {
          if (command.keyCommand === "image") {
            return (
              <Button
                aria-label="Insert code"
                icon={<FileImageOutlined />}
                disabled={disabled}
                size="large"
                type="primary"
                onClick={(evn) => {
                  evn.stopPropagation();
                  executeCommand(command, command.groupName);
                }}
              ></Button>
            );
          }
        },
      }}
    />
  );
};
