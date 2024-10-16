/* eslint-disable react/prop-types */
import { Steps } from "antd";
export const StepsComponent = ({current = 0, items = []}) => {
  const {Step} = Steps;
  return (
    <div className="">
      <Steps current={current}>
        {items.map((item) => {
          return (
            <Step
              key={item.title}
              title={item.title}
              description={item.description} />
          )
        })}
      </Steps>
    </div>
  );
};
