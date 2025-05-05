import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { userStorage } from '@/lib/userStorage';
import { useAuth } from '@/lib/auth.tsx';

export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dailySleepGoal, setDailySleepGoal] = useState(8);
  const [preferredBedtime, setPreferredBedtime] = useState('22:30');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Store user credentials (in a real app, this would be handled by a backend)
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);

      // Generate a unique user ID
      const userId = crypto.randomUUID();
      localStorage.setItem('user-id', userId);
      // Store registration date
      localStorage.setItem('user-registered', new Date().toISOString());

      // Save user preferences
      userStorage.savePreferences({
        name,
        dailySleepGoal,
        preferredBedtime,
      });

      // Log the user in
      await login(email, password);
      setSuccess(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
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
          <p className="text-white">Create your account to start tracking your sleep</p>
        </div>
        <Card className="border-border/50 bg-gradient-to-b from-card/95 to-card shadow-xl backdrop-blur-sm w-full p-4 sm:p-8">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && (
            <div className="text-green-500 mb-4">
              Account created successfully! Redirecting...
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-lg h-12 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-lg h-12 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-lg h-12 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-lg h-12 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="dailySleepGoal">Daily Sleep Goal (hours)</Label>
              <select
                id="dailySleepGoal"
                value={dailySleepGoal}
                onChange={e => setDailySleepGoal(Number(e.target.value))}
                required
                className="text-lg h-12 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {Array.from({ length: 25 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="preferredBedtime">Preferred Bedtime</Label>
              <Input
                id="preferredBedtime"
                type="time"
                value={preferredBedtime}
                onChange={(e) => setPreferredBedtime(e.target.value)}
                required
                className="text-lg h-12 w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <Button type="submit" className="w-full bg-sleep-medium hover:bg-sleep-deep">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-sleep-medium hover:text-sleep-deep">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
