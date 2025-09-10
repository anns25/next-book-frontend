"use client";

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { PhotoCamera, Visibility, VisibilityOff, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { safeParse } from 'valibot';
import { loginSchema, signupSchema } from '@/app/lib/validation/authSchema';


const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
  overflow: 'hidden',
  boxShadow: theme.shadows[6],
  borderRadius: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(0),
    borderRadius: theme.spacing(0),
    boxShadow: theme.shadows[0],
    maxWidth: '100vw'
  },
}));

const LeftSide = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundImage:
    'url(https://images.unsplash.com/photo-1571596667548-606cf9fe27c6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    minHeight: '40vh'
  },
}));

const RightSide = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
    minHeight: 600
  },
}));

const Login = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [isSeller, setIsSeller] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { login, register } = useAuth();
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleClickShowSignupPassword = () => {
    setShowSignupPassword(!showSignupPassword);
  }

  const handleFieldChange = (fieldName: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }));

    // Clear error for this field if it exists
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = safeParse(loginSchema, { username: formValues.username, password: formValues.password });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};

      result.issues.forEach(issue => {
        const field = issue.path?.[0].key as string;

        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }


    const success = await login({ username: formValues.username, password: formValues.password });
    if (success) {
      router.push('/');
    } else {
      setErrors({ general: "Invalid username or password" });

    }
    // } catch (err: any) {
    //   console.log("login error : ", err);
    //   setErrors({ general: err.response?.data?.message || "An error occurred during login" });
    // }
  }

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: "Please select an image file" });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size must be less than 5MB" });
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: undefined }));

    }
  }

  // Remove selected Image
  const handleRemoveImage = () => {
    setImageFile(null);
    setErrors(prev => ({ ...prev, image: undefined }));
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = safeParse(signupSchema, { username: formValues.username, password: formValues.password, image: imageFile, email: formValues.email });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};

      result.issues.forEach(issue => {
        const field = issue.path?.[0].key as string;

        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      if (!imageFile) {
        setErrors({ ...errors, image: "Profile image is required" });
        return;
      }
      const success = await register({
        username: formValues.username,
        password: formValues.password,
        email: formValues.email,
        role: isSeller ? 'seller' : 'buyer',
        user_img: imageFile
      });

      if (success) {
        router.push('/');
      } else {
        setErrors({ general: "Registration failed" });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: "An error occurred during registration" });
      }
    }
  }

    return (
      <StyledPaper>
        <LeftSide />

        <RightSide>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{ marginBottom: 4 }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {tab === 0 ? (
            <>
              <Typography variant="h5" fontFamily="Playfair Display" gutterBottom>
                Welcome Back
              </Typography>
              {errors.general && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {errors.general}
                </Typography>
              )}
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  value={formValues.username}
                  onChange={(e) => handleFieldChange("username", e.target.value)}
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  margin="normal"
                  value={formValues.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  type="submit"
                >
                  Sign In
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5" fontFamily="Playfair Display" gutterBottom>
                Create an Account
              </Typography>
              {errors.general && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {errors.general}
                </Typography>
              )}
              <form onSubmit={handleSignUp}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  value={formValues.username}
                  onChange={(e) => handleFieldChange("username", e.target.value)}
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                />
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type={showSignupPassword ? "text" : "password"}
                  margin="normal"
                  value={formValues.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowSignupPassword} edge="end">
                          {showSignupPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2">
                    Profile Image
                  </Typography>
                  {imageFile ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, mb: 2 }}>
                      <Typography variant="body2" color={theme.palette.text.primary}>
                        {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={handleRemoveImage}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: 'center', mt: 2, gap: 2 }}>
                      <Button
                        variant='outlined'
                        component="label"
                        color="primary"
                        startIcon={<PhotoCamera />}
                        sx={{ minWidth: 200 }}>
                        Choose Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Button>
                    </Box>
                  )}

                  {errors.image && (
                    <Typography variant="caption" color="error">
                      {errors.image}
                    </Typography>
                  )}
                </Box>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  value={formValues.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
                <Box mt={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSeller}
                        onChange={(e) => setIsSeller(e.target.checked)}
                        name="role"
                        color="primary"
                      />
                    }
                    label="Sign up as Seller"
                  />
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  type="submit"
                >
                  Sign Up
                </Button>
              </form>
            </>
          )}
        </RightSide>
      </StyledPaper>
    );
  };

  export default Login;