/* eslint-disable react/prop-types */
import { Modal } from "antd";

export const ModalComponent = ({ title = 'Modal', isOpen = false, children, ...rests }) => {
  return (
    <Modal title={title} open={isOpen} {...rests}>
      {children}
    </Modal>
  );
};
