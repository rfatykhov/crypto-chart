import React from "react";

const Card = props => {
  const value = !isNaN(props.value)
    ? Math.round(parseInt(props.value))
    : props.value;
  return (
    <>
      <img src={props.src} alt={props.src} />
      <h4>{props.name}</h4>
      <h2>${value}</h2>
    </>
  );
};

export default Card;
