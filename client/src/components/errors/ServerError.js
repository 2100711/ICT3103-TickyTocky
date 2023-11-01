import React from 'react';
import { Result, Button } from 'antd';

export const ServerError = () => {
  return (
    <Result
      status="500"
      title="500 - Internal Server Error"
      subTitle="Sorry, something went wrong on our end."
      extra={
        <Button type="primary" href="/">
          Back to Home
        </Button>
      }
    />
  );
};
