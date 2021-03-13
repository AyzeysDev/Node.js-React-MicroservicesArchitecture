import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewFood = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/foods',
    method: 'post',
    body: {
      name, price
    },
    onSuccess: (food) => Router.push('/')
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  }

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
  <div>
    <h1>Create a Food</h1>
    <form onSubmit= {onSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input value={name} 
        onChange={(e) =>setName(e.target.value)} 
        className="form-control" />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input value={price} 
        onBlur={onBlur}
        onChange={(e) =>setPrice(e.target.value)}
        className="form-control" />
      </div>
      {errors}
      <button className="btn-btn-primary text-info">Submit</button>
    </form>
  </div>
  );
};

export default NewFood;