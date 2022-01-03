import React from 'react';

const Notification = (props) => {
  const acceptedStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (props.error === null) {
    return null;
  }
  if (props.error === true) {
    return <div style={errorStyle}>{props.message}</div>;
  }

  return <div style={acceptedStyle}>{props.message}</div>;
};

export default Notification;
