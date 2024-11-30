import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

type SignupFormValues = {
  fullName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  submit?: string;
};

const SignupSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  dateOfBirth: Yup.string()
    .required('Date of birth is required')
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{2}$/, 'Invalid date format (MM/DD/YY)'),
  phoneNumber: Yup.string()
    .matches(/^\+\d{1,3}\s?\d{6,14}$/, 'Invalid phone number format')
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting, setErrors }: FormikHelpers<SignupFormValues>
  ) => {
    try {
      const response = await axios.post('http://localhost:5000/api/signup', values);
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Signup failed' });
    }
    setSubmitting(false);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="auth-card card p-4">
            <h2 className="text-center mb-4 auth-title">Sign Up</h2>
            <Formik<SignupFormValues>
              initialValues={{
                fullName: '',
                email: '',
                dateOfBirth: '',
                phoneNumber: '',
                password: '',
                confirmPassword: '',
                submit: undefined,
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <Field name="fullName" type="text" className={`form-control ${errors.fullName && touched.fullName ? 'is-invalid' : ''}`} />
                    <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field name="email" type="email" className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} />
                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth (MM/DD/YY)</label>
                    <Field name="dateOfBirth" type="text" placeholder="MM/DD/YY" className={`form-control ${errors.dateOfBirth && touched.dateOfBirth ? 'is-invalid' : ''}`} />
                    <ErrorMessage name="dateOfBirth" component="div" className="invalid-feedback" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number (with country code)</label>
                    <Field name="phoneNumber" type="text" placeholder="+1 1234567890" className={`form-control ${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : ''}`} />
                    <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Field name="password" type="password" className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`} />
                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <Field name="confirmPassword" type="password" className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`} />
                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                  </div>

                  {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <p className="text-center mt-3">
              Already have an account? <Link to="/login" className="auth-link">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

