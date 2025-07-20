// Health check endpoint
import { GetServerSideProps } from 'next';

export default function Health() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 200;
  res.end();
  return { props: {} };
};
