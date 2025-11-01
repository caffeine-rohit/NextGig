import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { InputField } from '../../components/common/InputField';
import { SelectField } from '../../components/common/SelectField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { validateEmail, validatePassword } from '../../utils/validators';

interface RegisterPageProps {
  onRegister: (
    email: string,
    password: string,
    fullName: string,
    role: 'candidate' | 'employer'
  ) => Promise<void>;
}

export function RegisterPage({ onRegister }: RegisterPageProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate' as 'candidate' | 'employer',
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setLoading(true);
      await onRegister(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      );
      navigate('/');
    } catch (error: any) {
      setServerError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-primary rounded-lg p-3">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-dark font-heading">
              OpportunityHub
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-dark font-heading mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 font-body">
            Join thousands of professionals finding opportunities
          </p>
        </div>

        <div className="bg-white rounded-card shadow-custom-lg p-8">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-input">
              <p className="text-sm text-red-600 font-body">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              error={errors.fullName}
              placeholder="John Doe"
            />

            <InputField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="you@example.com"
            />

            <SelectField
              label="I am a..."
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'candidate' | 'employer',
                })
              }
              options={[
                { value: 'candidate', label: 'Job Seeker / Candidate' },
                { value: 'employer', label: 'Employer / Recruiter' },
              ]}
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              placeholder="Minimum 8 characters"
              helperText="Must contain uppercase, lowercase, and numbers"
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              placeholder="Re-enter your password"
            />

            <PrimaryButton
              type="submit"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              Create Account
            </PrimaryButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-body">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-primary font-semibold hover:text-primary-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
