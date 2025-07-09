export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 14 4-4" />
      <path d="M12 18V6l-4 4" />
      <path d="M22 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" />
    </svg>
  )
  
  export const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-5.07 2.04-4.34 0-7.88-3.54-7.88-7.88s3.54-7.88 7.88-7.88c2.38 0 4.03.98 4.98 1.9l2.6-2.6C19.97 1.9 16.96 0 12.48 0 5.88 0 0 5.88 0 12s5.88 12 12.48 12c7.28 0 12.16-5.12 12.16-12.36 0-.7-.06-1.4-.18-2.08l-11.98-.01z"
      />
    </svg>
  )
  