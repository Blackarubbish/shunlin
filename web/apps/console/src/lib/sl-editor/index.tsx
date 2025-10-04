import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import "./styles/index.css";
import { FileImageOutlined } from "@ant-design/icons";
import { Button } from "antd";

export const SLEditor = () => {
	const [value, setValue] = useState("");
	return (
		<MDEditor
			value={value}
			preview="edit"
			onChange={(value) => setValue(value || "")}
			height={800}
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
