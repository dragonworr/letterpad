import React, { Component } from "react";
import ArticleCreate from "../components/posts/ArticleCreate";
import { gql, graphql } from "react-apollo";
import PostPublish from "../components/posts/PostPublish";
import PostActions from "../components/posts/PostActions";
import Tags from "../components/posts/Tags";
import Categories from "../components/posts/Categories";

export default function Create(type) {
    class Create extends Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                post: {}
            };
        }
        componentDidMount() {
            let that = this;
            this.props.createPost({ type: type }).then(result => {
                PostActions.setData(result.data.createPost);
                this.setState({ loading: false, post: result.data.createPost });
            });

            PostActions.subscribe(id => {
                that.props.router.push(`/admin/${type}/${id}`);
            });
            document.body.classList.add(`create-${type}`);
        }
        render() {
            let page = type;
            if (this.state.loading) {
                return <div>hello</div>;
            }
            return (
                <section className="module p-t-20">
                    <div className="container-fluid container-custom">
                        <div className="col-lg-8 column">
                            <ArticleCreate post={this.state.post} />
                        </div>
                        <div className="col-lg-4 column">
                            <PostPublish post={this.state.post} />
                            <hr />
                            <Tags post={this.state.post} />
                            <hr />
                            <Categories post={this.state.post} />
                        </div>
                    </div>
                </section>
            );
        }
    }

    const createPostQuery = gql`
        mutation createPost($type: String!) {
            createPost(type: $type) {
                id
                title
                body
                author {
                    username
                }
                status
                type
                excerpt
                created_at
                cover_image
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    `;

    const createQueryWithData = graphql(createPostQuery, {
        props: ({ mutate }) => ({
            createPost: data =>
                mutate({
                    variables: data
                })
        })
    });

    return createQueryWithData(Create);
}
