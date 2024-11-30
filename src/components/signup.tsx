import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img2 from "../assets/img2.jpg";

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
    <div className="container-fluid vh-100">
      <div className="row h-100 p-3" style={{backgroundColor:"#e6f2fe"}}>
        {/* Illustration Section */}
        <div className="col-lg-8 d-none d-lg-block p-0">
          <img src={img2} alt="Decorative illustration" className="img-fluid mr-4 rounded h-100 object-fit-cover" style={{width:"98%"}} />
        </div>

        {/* Form Section */}
        <div className="col-lg-4 rounded shadow bg-light d-flex align-items-center justify-content-center">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <h2 className="bold mt-2">Create an account</h2>
            <p className="mb-4">Enter details below to create an account.</p>

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
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <Field name="fullName" type="text" className={`form-control ${errors.fullName && touched.fullName ? 'is-invalid' : ''}`} />
                      <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field name="email" type="email" className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="dateOfBirth" className="form-label">Date of Birth (MM/DD/YY)</label>
                      <Field name="dateOfBirth" type="text" placeholder="MM/DD/YY" className={`form-control ${errors.dateOfBirth && touched.dateOfBirth ? 'is-invalid' : ''}`} />
                      <ErrorMessage name="dateOfBirth" component="div" className="invalid-feedback" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                      <Field name="phoneNumber" type="text" placeholder="+1 1234567890" className={`form-control ${errors.phoneNumber && touched.phoneNumber ? 'is-invalid' : ''}`} />
                      <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                    </div>
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

                  {errors.submit && <div className="alert alert-danger" role="alert">{errors.submit}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-100"
                    style={{ backgroundColor: '#2A5A3C', borderColor: '#2A5A3C' }}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center mt-3">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#FF8A00' }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

