import Link from 'next/link';

const LandingPage = ({ currentUser, foods }) => {
  const foodList = foods.map((food) => {
    return (
      <tr key={food.id}>
        <td>{food.name}</td>
        <td>{food.price}</td>
        <td>
          <Link href="/foods/[foodId]" as={`/foods/${food.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  
  
  return (
    <div>
      <h1>Foods</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{foodList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/foods');

  return { foods: data };
};

export default LandingPage;
