describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Superuser',
      username: 'root',
      password: 'password',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is show', function () {
    cy.visit('http://localhost:3000');
    cy.contains('Log in to Application');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'root',
        password: 'password',
      }).then((response) => {
        localStorage.setItem(
          'loggedBlogappUser',
          JSON.stringify(response.body)
        );
      });
      cy.visit('http://localhost:3000');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('root');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();
      cy.get('.error')
        .should('contain', 'Wrong')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: 'password' });
    });

    it('A blog can be created', function () {
      cy.contains('Create New Blog').click();
      cy.get('#title-input').type('New Blog Entry');
      cy.get('#author-input').type('New Blog Author');
      cy.get('#url-input').type('New Blog Url');
      cy.get('#createblog-button').click();

      // Checks notification message
      cy.get('.error')
        .should('contain', 'A New Blog')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid');
      //Checks if it is added to the blog list
      cy.contains('New Blog Entry New Blog Author');
    });

    describe('Blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'new blog',
          author: 'new author',
          url: 'new url',
        });
      });

      it('A blog can be liked', function () {
        cy.get('#viewButton').click();
        // Checks starting likes is 0
        cy.contains('Likes 0');
        cy.get('.likeButton').click();
        // Check that likes increased to 1
        cy.contains('Likes 1');
      });

      it('A blog can be deleted', function () {
        cy.get('#viewButton').click();
        cy.get('#deleteButton').click();

        // Checks notification message
        cy.get('.error')
          .should('contain', 'The blog')
          .and('have.css', 'color', 'rgb(255, 0, 0)')
          .and('have.css', 'border-style', 'solid');
      });

      it('A blog delete button does not show for users that did not create blog', function () {
        const user = {
          name: 'AnotherUser',
          username: 'anotherUser',
          password: 'password',
        };
        cy.request('POST', 'http://localhost:3003/api/users/', user);
        cy.get('#logout-button').click();
        cy.login({ username: 'anotherUser', password: 'password' });
        cy.get('#viewButton').click();
        cy.get('#deleteButton').should('not.exist');
      });
    });

    describe('Multiple blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'new author',
          url: 'new url',
        });

        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'new author',
          url: 'new url',
        });
      });

      it.only('The blog posts are ordered by most likes', function () {
        // Likes the blog with the second most likes
        cy.contains('The title with the second most likes')
          .find('button')
          .click();
        cy.contains('The title with the second most likes')
          .children()
          .find('.likeButton')
          .as('secondMostLikesButton');
        cy.get('@secondMostLikesButton').click();
        cy.wait(500);
        cy.get('@secondMostLikesButton').click();
        cy.wait(500);

        // Likes the blog with the most likes
        cy.contains('The title with the most likes').find('button').click();
        cy.contains('The title with the most likes')
          .children()
          .find('.likeButton')
          .as('mostLikesButton');
        cy.get('@mostLikesButton').click();
        cy.wait(500);
        cy.get('@mostLikesButton').click();
        cy.wait(500);
        cy.get('@mostLikesButton').click();
        cy.wait(500);

        cy.get('.blog')
          .eq(0)
          .should('contain', 'The title with the most likes');
        cy.get('.blog')
          .eq(1)
          .should('contain', 'The title with the second most likes');
      });
    });
  });
});
