import { useAppTheme } from '@/context/ThemeContext';

const { theme } = useAppTheme();
const backgroundColor = theme === 'dark' ? '#1e293b' : '#fdfdfd';
const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';
