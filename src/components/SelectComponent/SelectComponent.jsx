import { Select } from "antd"


// eslint-disable-next-line react/prop-types
export const SelectComponent = ({ defaultValue, options = [], ...rests }) => {
  return (
    <Select
      defaultValue={defaultValue}
      options={options}
      {...rests}
    />
  )
}
