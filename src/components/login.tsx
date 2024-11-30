import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

type LoginFormValues = {
  email: string;
  password: string;
  submit?: string;
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', values);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.userName); // Store the user's name
        navigate('/');
      }
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Login failed' });
    }
    setSubmitting(false);
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="auth-card card p-4" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="text-center mb-4 auth-title">Login</h2>
        <Formik<LoginFormValues>
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
                <Field name="email" type="email" className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} />
                <ErrorMessage name="email" component="div" className="invalid-feedback" />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <Field name="password" type="password" className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`} />
                <ErrorMessage name="password" component="div" className="invalid-feedback" />
              </div>

              {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup" className="auth-link">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

