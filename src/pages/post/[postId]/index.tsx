import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function PostPage() {
  return (
    <div>
      <h1>This is the post page</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});
