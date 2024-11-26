/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom"


export const TypeProduct = ({name}) => {
  const navigate = useNavigate()
  const handleNavigateType = (type) => {
    navigate(`/products/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
  }
  return (
    <div className=" cursor-pointer hover:underline font-semibold" onClick={() => handleNavigateType(name)}>
      <p className="border-r p-1">{name}</p>
    </div>
  )
}
