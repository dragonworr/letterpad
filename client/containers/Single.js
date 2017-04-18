import React, { Component } from "react";
import Article from "../components/post/Article";
import { gql, graphql } from "react-apollo";

class Single extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {(() => {
                    if (this.props.loading || this.props.adjPostsLoading) {
                        return <div>hello</div>;
                    } else {
                        if (this.props.post === null) {
                            return <div>Nothing found..Absolute bullshit</div>;
                        }
                        return (
                            <Article
                                post={this.props.post}
                                adjacentPosts={this.props.adjacentPosts}
                            />
                        );
                    }
                })()}
            </div>
        );
    }
}

const singlePost = gql`
  query singlePost($permalink:String) {
  post(type:"post",permalink:$permalink) {
    id,
    title,
    body,
    status,
    created_at,
    excerpt,
    cover_image,
    taxonomies {
        id,
        name,
        type
    }
  }
}
`;
const ContainerWithPostData = graphql(singlePost, {
    options: props => {
        return {
            variables: {
                permalink: props.params.permalink
            }
        };
    },
    props: ({ data: { loading, post } }) => ({
        post,
        loading
    })
});

const adjacentPosts = gql`
  query adjacentPosts($permalink:String) {
  adjacentPosts(type:"post",permalink:$permalink) {
    id,
    title,
    permalink
  }
}
`;
const adjacentPostsData = graphql(adjacentPosts, {
    options: props => {
        return {
            variables: {
                permalink: props.params.permalink
            }
        };
    },
    props: ({ data: { loading, adjacentPosts } }) => ({
        adjacentPosts,
        adjPostsLoading: loading
    })
});
export default adjacentPostsData(ContainerWithPostData(Single));
