'use client'
import { useTheme } from '@mui/material/styles';
import { AppBar, Avatar, Badge, Box, Button, Container, Drawer, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AutoStories } from '@mui/icons-material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
    const theme = useTheme();
    const { logout, user } = useAuth();
    const router = useRouter();
    const { totalItems } = useCart();
  
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        handleCloseUserMenu();
        await logout();
    }

    // Helper function to get full image URL
    const getUserImageUrl = () => {
        if (!user || !user.user_img) return null;

        // If user_img is already a full url (from old data), use it as is
        if (user.user_img.startsWith('http')) {
            return user.user_img;
        }

        // If user_img is a filename, construct the full URL to the backend
        return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.user_img}`;
    };

    // FOR HAMBURGER MENU
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const pages = [{ label: 'Home', path: "/" }, { label: 'Categories', path: '/categories' }, { label: 'About', path: '/about' }, { label: 'Contact', path: '/contact' }];

    return (
        <Box sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
            <Container >
                <AppBar position="static" elevation={0}>
                    <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                        {isMediumScreen && (
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={() => setDrawerOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        {/* Left: Brand and center brand for medium screen */}
                        <Box sx={{ flexGrow: { xs: 1, md: 0 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <IconButton color="inherit">
                                <AutoStories sx={{ width: { xs: 18, sm: 22 } }} />
                            </IconButton>
                            <Typography
                                variant={isSmallScreen ? 'subtitle1' : 'h6'}
                                sx={{
                                    fontWeight: 'bold',
                                    fontFamily: theme.typography.h1.fontFamily,
                                }}
                            >
                                The Book Nook
                            </Typography>
                        </Box>

                        {/* Center: Navigation Links */}
                        {!isMediumScreen && (
                            <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: { sm: 0, md: 3 } }}>
                                {pages.map((page) => (
                                    <Button
                                        variant="text"
                                        component={Link}
                                        href={page.path}
                                        key={page.label}
                                        color="inherit"
                                        sx={{
                                            fontSize: { sm: '10px', md: '14px' },
                                            fontFamily: theme.typography.body1.fontFamily,
                                        }}
                                    >
                                        {page.label}
                                    </Button>
                                ))}
                            </Box>
                        )}

                        {/* Right Cart and Avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1, md: 2 } }}>
                            <Link href="/cart">
                                <IconButton color="inherit" onClick={()=> router.push('/cart')}>
                                    <Badge badgeContent={totalItems} color="primary">
                                        <ShoppingCartIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                                    </Badge>
                                </IconButton>
                            </Link>
                            {user && (
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Click to logout">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar
                                                alt="User"
                                                src={getUserImageUrl() || undefined}
                                                sx={{
                                                    width: { xs: 20, sm: 40 },
                                                    height: { xs: 20, sm: 40 }
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                        PaperProps={{
                                            sx: {
                                                backgroundColor: theme.palette.secondary.main, // sets full menu bg
                                                color: theme.palette.text.primary,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.secondary.dark, // optional hover color
                                                }
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            onClick={handleLogout}
                                            sx={{
                                                fontSize: { sm: '10px', md: '14px' },
                                                fontFamily: theme.typography.body1.fontFamily,
                                                backgroundColor: theme.palette.secondary.main,
                                                color: theme.palette.text.primary,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.secondary.dark, // optional hover color
                                                }
                                            }}
                                        >
                                            LOGOUT
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            )}

                            {isMediumScreen && (
                                <>
                                    <Drawer
                                        anchor="left"
                                        open={drawerOpen}
                                        onClose={() => setDrawerOpen(false)}
                                    >
                                        <Box sx={{ width: 200, height: '100vh', backgroundColor: theme.palette.secondary.main }}>
                                            <List>
                                                {pages.map((page) => (
                                                    <ListItemButton
                                                        key={page.label}
                                                        component={Link}
                                                        href={page.path}
                                                        onClick={() => setDrawerOpen(false)}
                                                    >
                                                        <ListItemText sx={{ color: theme.palette.text.primary }} primary={page.label} />
                                                    </ListItemButton>
                                                ))}
                                                {!user && (
                                                    <>
                                                        <ListItemButton
                                                            component={Link}
                                                            href="/login"
                                                            onClick={() => setDrawerOpen(false)}
                                                        >
                                                            <ListItemText sx={{ color: theme.palette.text.primary }} primary="Login" />
                                                        </ListItemButton>
                                                        <ListItemButton
                                                            component={Link}
                                                            href="/register"
                                                            onClick={() => setDrawerOpen(false)}
                                                        >
                                                            <ListItemText sx={{ color: theme.palette.text.primary }} primary="Sign Up" />
                                                        </ListItemButton>
                                                    </>
                                                )}
                                            </List>
                                        </Box>
                                    </Drawer>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>
            </Container>
        </Box>
    )
}

export default Navbar