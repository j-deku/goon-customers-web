import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUserInfo, 
  recoverSession,
  selectIsAuthenticated, 
  selectUserStatus, 
  selectShouldRefreshUser,
  selectIsOnline,
  selectUserError,
  setOnlineStatus,
  restoreUserState,
  clearError
} from '../../features/user/userSlice';   
 
const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userStatus = useSelector(selectUserStatus);
  const shouldRefresh = useSelector(selectShouldRefreshUser);
  const isOnline = useSelector(selectIsOnline);
  const userError = useSelector(selectUserError);
  
  const fetchAttempted = useRef(false);
  const retryTimeoutRef = useRef(null);
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Enhanced retry logic with exponential backoff
  const scheduleRetry = useCallback((attempt = 0) => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    if (attempt >= maxRetries) {
      console.log('Max retries reached for session recovery');
      return;
    }

    // Exponential backoff: 30s, 60s, 120s
    const delay = 30000 * Math.pow(2, attempt);
    
    retryTimeoutRef.current = setTimeout(() => {
      if (navigator.onLine && localStorage.getItem("userId")) {
        console.log(`Retrying session recovery (attempt ${attempt + 1}/${maxRetries})...`);
        dispatch(recoverSession())
          .unwrap()
          .then(() => {
            console.log('✅ Session recovered on retry');
            retryCount.current = 0;
          })
          .catch((error) => {
            console.log('❌ Retry failed:', error);
            retryCount.current = attempt + 1;
            
            // Continue retrying if it's a network issue
            if (!navigator.onLine || error.includes('Network') || error.includes('fetch')) {
              scheduleRetry(retryCount.current);
            }
          });
      }
    }, delay);
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('📶 Connection restored');
      dispatch(setOnlineStatus(true));
      dispatch(clearError()); 
      
      retryCount.current = 0;
      
      // Immediate retry when coming back online
      const userId = localStorage.getItem("userId");
      if (userId && (shouldRefresh || userError)) {
        console.log('🔄 Refreshing user info after reconnection');
        dispatch(fetchUserInfo())
          .unwrap()
          .catch((error) => {
            console.warn('Post-reconnection refresh failed:', error);
          });
      }
    };

    const handleOffline = () => {
      console.log('📴 Connection lost');
      dispatch(setOnlineStatus(false));
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };

    // Set initial online status
    dispatch(setOnlineStatus(navigator.onLine));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, shouldRefresh, userError]);

  useEffect(() => {
    dispatch(restoreUserState());
    
    const userId = localStorage.getItem("userId");
    
    if (userId && !fetchAttempted.current && navigator.onLine) {
      fetchAttempted.current = true;
      
      console.log('🔐 Attempting session recovery...');
      
      const recoveryPromise = dispatch(recoverSession());
      
      const timeoutId = setTimeout(() => {
        console.warn('⏱️ Session recovery timeout - treating as network issue');
      }, 15000); // 15 second timeout
      
      recoveryPromise
        .unwrap()
        .then(() => {
          clearTimeout(timeoutId);
          console.log('✅ Session recovered successfully');
          retryCount.current = 0;
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.log('❌ Session recovery failed:', error);
          
        const errorMessage = 
          typeof error === 'string' 
            ? error 
            : (error?.message || error?.toString?.() || '');

        const shouldRetry = (
          !navigator.onLine ||
          errorMessage.includes('Network') ||
          errorMessage.includes('fetch') ||
          errorMessage.includes('timeout') ||
          (typeof error === 'object' && error?.type === 'NETWORK_ERROR')
        );
          
          if (shouldRetry) {
            console.log('🔄 Scheduling retry for network-related error');
            scheduleRetry(0);
          } else {
            console.log('🚫 Not retrying - likely auth error:', error);
          }
        });
    } else if (userId && !navigator.onLine) {
      console.log('📴 Offline - will retry session recovery when online');
    }
  }, [dispatch, scheduleRetry]);

  useEffect(() => {
    if (!isAuthenticated || !isOnline || userStatus === 'loading') return;

    const interval = setInterval(() => {
      if (shouldRefresh) {
        console.log('🔄 Refreshing user info (periodic check)');
        dispatch(fetchUserInfo())
          .unwrap()
          .then(() => {
            console.log('✅ Periodic refresh successful');
          })
          .catch((error) => {
            console.warn('⚠️ Periodic refresh failed:', error);
          });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated, isOnline, shouldRefresh, userStatus]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && isOnline && shouldRefresh) {
        console.log('👁️ Page visible - checking if refresh needed');
        dispatch(fetchUserInfo()).unwrap().catch((error) => {
          console.warn('Visibility-triggered refresh failed:', error);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, isAuthenticated, isOnline, shouldRefresh]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log('🔍 Auth State:', {
        isAuthenticated,
        userStatus,
        shouldRefresh,
        isOnline,
        hasError: !!userError,
        hasUserId: !!localStorage.getItem("userId")
      });
    }
  }, [isAuthenticated, userStatus, shouldRefresh, isOnline, userError]);

  return children;
};

export default AuthGuard;