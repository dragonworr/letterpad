import React, { Component } from "react";
import { Link } from "react-router";

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navbarOpen: false,
            postsOpen: false,
            pagesOpen: false
        };
    }
    navbarToggle() {
        this.setState({ navbarOpen: !this.state.navbarOpen });
    }
    toggleItem(item, e) {
        e.preventDefault();
        this.state[item] = !this.state[item];
        this.setState(this.state);
    }
    render() {
        let navbarStatus = this.state.navbarOpen ? "in" : "";
        let postsStatus = this.state.postsOpen ? "" : "hide";
        let pagesStatus = this.state.pagesOpen ? "" : "hide";
        return (
            <div className="sidebar">
                <nav className="navbar navbar-custom font-alt">
                    <div className="navbar-header">
                        <button
                            type="button"
                            className="navbar-toggle"
                            data-toggle="collapse"
                            data-target="#custom-collapse"
                            onClick={this.navbarToggle.bind(this)}
                        >
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>

                        <Link className="navbar-brand" to="/">
                            Dashboard
                        </Link>
                    </div>

                    <div
                        className={"collapse navbar-collapse " + navbarStatus}
                        id="custom-collapse"
                    >

                        <ul className="nav navbar-nav">
                            <li>
                                <Link
                                    className="parent"
                                    to="null"
                                    onClick={e =>
                                        this.toggleItem("postsOpen", e)}
                                >
                                    <i
                                        className={
                                            "fa fa-" +
                                                (this.state.postsOpen
                                                    ? "angle-down"
                                                    : "angle-right")
                                        }
                                        aria-hidden="true"
                                    />
                                    Posts
                                </Link>
                                <ul className={postsStatus}>
                                    <li className="item">
                                        <Link to="/admin/posts">All Posts</Link>
                                    </li>
                                    <li className="item">
                                        <Link to="/admin/post-new">
                                            New Post
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link
                                    to="null"
                                    className="parent"
                                    onClick={e =>
                                        this.toggleItem("pagesOpen", e)}
                                >
                                    <i
                                        className={
                                            "fa fa-" +
                                                (this.state.pagesOpen
                                                    ? "angle-down"
                                                    : "angle-right")
                                        }
                                        aria-hidden="true"
                                    />
                                    Pages
                                </Link>
                                <ul className={pagesStatus}>
                                    <li className="item">
                                        <Link to="/admin/pages">All Pages</Link>
                                    </li>
                                    <li className="item">
                                        <Link to="/admin/page-new">
                                            New Page
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="item">
                                <Link to="/admin/settings">Settings</Link>
                            </li>
                            <li className="item">
                                <Link to="/admin/authors">Authors</Link>
                            </li>
                        </ul>
                    </div>

                </nav>

                <div className="copyright">
                    <div className="social-icons m-b-20">
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-facebook facebook"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-twitter twitter"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-instagram instagram"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-behance behance"
                        />
                        <a
                            href="#"
                            target="_blank"
                            className="fa fa-dribbble dribbble"
                        />
                    </div>

                    <p>© 2017 Ajaxtown</p>
                </div>

            </div>
        );
    }
}
