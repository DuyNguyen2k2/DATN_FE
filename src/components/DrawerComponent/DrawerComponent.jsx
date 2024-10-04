/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Drawer } from "antd"

export const DrawerComponent = ({title = 'Drawer', placement = 'right', isOpen = false, children, ...rests}) => {
  return (
    <>
      <Drawer title={title} placement={placement} open={isOpen} {...rests}>
        {children}
      </Drawer>
    </>
  )
}
