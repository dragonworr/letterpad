import Head from "next/head";
import { FC } from "react";
import { Content, PageHeader } from "ui";

import { MeFragmentFragment } from "@/__generated__/queries/queries.graphql";
import { SettingsFragmentFragment } from "@/graphql/queries/partial.graphql";

interface Props {
  author: MeFragmentFragment;
  settings: SettingsFragmentFragment;
}
export const News: FC<Props> = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Content>
        <PageHeader title="Whats new! 🎉" className="site-page-header">
          <span className="help-text">Read latest updates here.</span>
        </PageHeader>
        Latest Releases
      </Content>
    </>
  );
};
