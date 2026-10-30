import React from 'react';
import Layout from './Layout';
import SpiderSection from './components/SpiderSection';

export { Layout };

export default function App() {
  return (
    <Layout>
      <div className="-mt-32">
        <SpiderSection />
      </div>
    </Layout>
  );
}
