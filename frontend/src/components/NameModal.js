import { Modal, Input } from "antd";

export default function NameModal({
  open,
  title,
  value,
  onChange,
  onOk,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      okButtonProps={{ className: "bg-pink-500 hover:bg-pink-600 border-none" }}
      cancelButtonProps={{ className: "text-pink-300" }}
      title={title}
    >
      <Input
        autoFocus
        placeholder="Enter name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPressEnter={onOk}
      />
    </Modal>
  );
}
