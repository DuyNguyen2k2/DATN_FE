/* eslint-disable react/prop-types */
export const LikeComponent = (props) => {
    const { dataHref } = props
  return (
    <div
      className="fb-like"
      data-href={dataHref}
      data-width=""
      data-layout=""
      data-action=""
      data-size=""
      data-share="true"
    ></div>
  );
};
