/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Input } from "antd";
import { useState } from "react";

export const InputForm = ( props ) => {
  const handleOnchangInput = (e)=>{
    props.handleonchange(e.target.value)
  }
  const { placeholder, handleonchange, ...res } = props;
  return <Input placeholder={placeholder} valueinput={props.value} onChange={(handleOnchangInput)} {...res} />;
};
