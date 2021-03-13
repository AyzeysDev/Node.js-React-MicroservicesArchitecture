import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const FoodShow = ({ food }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      foodId: food.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{food.name}</h1>
      <h4>Price: {food.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

FoodShow.getInitialProps = async (context, client) => {
  const { foodId } = context.query;
  const { data } = await client.get(`/api/foods/${foodId}`);

  return { food: data };
};

export default FoodShow;
