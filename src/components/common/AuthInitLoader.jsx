/**
 * Full-screen loader for app initialization
 * Shows while checking authentication state on app load
 */
const AuthInitLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Logo/Brand */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold">
            Endura <span className="text-green-500">Events</span>
          </h1>
        </div>

        {/* Spinner */}
        <div className="mb-4 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-500"></div>
        </div>

        {/* Loading text */}
        <p className="text-sm text-gray-600">Initializing...</p>
      </div>
    </div>
  );
};

export default AuthInitLoader;
