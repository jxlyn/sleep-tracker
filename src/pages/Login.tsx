import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth.tsx';
import { Link } from 'react-router-dom';
import { Moon } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/login_background.png')] bg-cover bg-no-repeat bg-center p-2 sm:p-4">
      <div className="w-full max-w-md space-y-2 sm:space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-block h-8 w-8 bg-gradient-to-r from-sleep-medium to-sleep-darkBlue rounded-full" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sleep-medium to-sleep-darkBlue bg-clip-text text-transparent">
              SlumberGlow
            </h1>
          </div>
          <p className="text-white">Welcome back! Sign in to access your sleep data</p>
        </div>
        <Card className="border-border/50 bg-gradient-to-b from-card/95 to-card shadow-xl backdrop-blur-sm w-full p-4 sm:p-8">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Moon className="h-8 w-8 text-sleep-medium" />
            </div>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your sleep data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-sleep-medium hover:bg-sleep-deep">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sleep-medium hover:text-sleep-deep">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};