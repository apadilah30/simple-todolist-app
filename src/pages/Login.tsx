import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { LoginSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';

type LoginFormData = z.infer<typeof LoginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: ''
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form submitted:', data);
    try {
      const response = await axiosInstance.post('/login', data);

      if (response.status !== 200) {
        toast.error('Login failed. Please try again.');
        throw new Error('Login failed');
      }

      toast("Login successful!");

      auth.login(response.data.data.token)
      navigate('/');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <AuthLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className='w-full'
            onClick={() => navigate('/register')}
            disabled={form.formState.isSubmitting}
          >
            Register
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;