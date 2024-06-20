import React from 'react';
import Page from '../components/Page';
import services from '../libs/Services';

function Home() {
  const [users, setUsers] = React.useState([]);
  const [formData, setFormData] = React.useState({ name: '', email: '', age: '' });
  const [errorMessage, setErrorMessage] = React.useState('');

  async function getUsers() {
    setErrorMessage('');

    try {
      const users = await services.mainApi.users();
      setUsers(users.data);
    } catch (error) {
      setErrorMessage('Failed to load users. Please try again.');
      console.error(error);
    }
  }

  React.useEffect(() => {
    getUsers();
  }, [  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserCreate = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const newUser = await services.mainApi.createUser(formData);
      setUsers([...users, newUser]);
      setFormData({ name: '', email: '', age: '' });
      getUsers();
    } catch (error) {
      if (error.status && error.status === 422) {
        setErrorMessage('Validation error. Please check the console.');
        console.error(error.body);
      } else {
        setErrorMessage('Failed to create user. Please try again.');
        console.error(error.body);
      }
    }
  };

  return (
    <Page title="Home">
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleUserCreate}>
        <div className="card my-5" style={{width: '18rem'}}>
          <div className="card-header">
            <b>Create User</b>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Age</label>
              <input
                type="text"
                className="form-control"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="card-footer text-right">
            <button type="submit" className="btn btn-primary">Create</button>
          </div>
        </div>
      </form>

      <div className="card mt-5">
        <div className="card-header">
          <b>User List</b>
        </div>
        <div className="card-body p-0">

          {(users && users.length > 0) ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">E-Mail</th>
                  <th scope="col">Age</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <th scope="row">{user.id}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h4 className="text-center p-5">No user found</h4>
          )}

        </div>
      </div>


    </Page>
  );
}

export default Home;