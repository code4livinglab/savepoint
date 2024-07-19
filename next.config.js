/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/sign-in',
        destination: '/users/sign-in',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/users/sign-up',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
