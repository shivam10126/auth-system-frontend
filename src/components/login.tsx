import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img1 from "../assets/img1.jpg";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

type LoginFormValues = {
  email: string;
  password: string;
  submit?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setErrors }: any
  ) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', values);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.userName);
        navigate('/');
      }
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Login failed' });
    }
    setSubmitting(false);
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100 p-3" style={{backgroundColor:"#e6f2fe"}}>
        {/* Illustration Section */}
        <div className="col-lg-8 d-none d-lg-block p-0 pr-4 ">
          <img src={img1} alt="Decorative illustration" className="img-fluid rounded mr-4 h-100 object-fit-cover" style={{width:"98%"}} />
        </div>

        {/* Form Section */}
        <div className="col-lg-4 rounded shadow bg-light ml-4 d-flex align-items-center justify-content-center">
          <div className="w-100 " style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Login</h2>

            <Formik
              initialValues={{
                email: '',
                password: '',
                submit: undefined,
              }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                      placeholder="enter your email..."
                    />
                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                      placeholder="enter your password..."
                    />
                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                  </div>

                  {errors.submit && (
                    <div className="alert alert-danger" role="alert">
                      {errors.submit}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-100"
                    style={{ backgroundColor: '#2A5A3C', borderColor: '#2A5A3C' }}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center mt-3">
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#FF8A00' }}>Sign up for free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

