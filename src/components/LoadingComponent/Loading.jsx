/* eslint-disable react/prop-types */
import { Spin } from "antd"


export const Loading = ({children, isLoading, delay = 500}) => {
  return (
    <Spin spinning={isLoading} delay={delay}>
        {children}
      </Spin>
  )
}
