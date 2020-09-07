const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)

// creatPages export
exports.createPages = async ({ actions, graphql, reporter }) => {
  // deconstructed from actions
  const { createPage } = actions

  // blogList is the path to the template file
  const blogList = path.resolve(`./src/templates/blog-list.js`)

  // projectList is the path to the template file
  const projectList = path.resolve(`./src/templates/project-list.js`)

  // result will be a GraphQL query that returns a node object
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              template
              title
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create blog posts
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const id = post.node.id
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.frontmatter.slug,
      component: path.resolve(
        `src/templates/${String(post.node.frontmatter.template)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
        previous,
        next,
      },
    })

  })

  // Create blog-list pages
  const postsPerPage = 9
  const numPages = Math.ceil(posts.length / postsPerPage)

  Array.from({ length: numPages }).forEach((_, i) => {
    // createPages for blog collection
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: blogList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
    // createPages for project collection
    createPage({
      path: i === 0 ? `/project` : `/project/${i + 1}`,
      component: projectList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })
}

// conCreateNode export
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}