const ArticleModels = require('../models/articles.models');

const url = process.env.URL || process.env.LOCAL_URL;

class ArticleController {
  /**metodo para listar todos os artigos */
  static async apiGetAllArticles(req, res) {
    try {
      let page = parseInt(req.query.page || 1);
      let limit = parseInt(req.query.limit || 10);

      const {
        articleList,
        totalNumArticle,
        count,
      } = await ArticleModels.getAllModels(page, limit);

      articleList.map((article) => {
        article.url = `${url}/api/v1/articles/${article._id}`;
        article.method = 'GET';
        article.type = 'Details';
      });

      let response = {
        articles: articleList,
        total_results: totalNumArticle,
        page: page,
        count,
        limit,
      };

      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({
        code: 500,
        message: `Erro interno, por favor tente mas tarde`,
        description: `${e}`,
      });
    }
  }

  /**Metodo para listar um artigo especifico */
  static async apiGetArticle(req, res) {
    try {
      const articleId = req.params.articleId;

      const response = await ArticleModels.getArticle(articleId);

      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({
        code: 500,
        message: `Erro interno, por favor tente mas tarde`,
        description: `${e}`,
      });
    }
  }

  //TODO:Adicionar a validação JWT para poder adicionar os articles

  /**Metodo para adicionar um artigo */
  static async apiAddArticle(req, res) {
    try {
      const {
        title,
        body,
        author,
        shareMessage,
        seoTitle,
        seoDescription,
      } = req.body;

      let data = {
        title: title,
        body: body,
        author: author,
        shareMessage: shareMessage,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        createdDate: new Date(),
      };

      // console.log(data);

      const resultInsert = await ArticleModels.addArticle(data);

      if (!resultInsert.error) {
        res.status(201).json({
          status: 'Sucesso',
          url: `${url}/api/v1/articles/${resultInsert.articleId}`,
        });
      }
    } catch (e) {
      res.status(500).json({
        code: 500,
        message: `Erro interno, por favor tente mas tarde`,
        description: `${e}`,
      });
    }
  }

  //TODO:Adicionar a validação JWT para poder alterar os articles
  /**metodo para alterar um artigo */
  static async apiAlterArticle(req, res) {
    try {
      const articleId = req.params.articleId;
      const updateUser = '123546546548';
      const articleData = req.body;

      const resultUpdate = await ArticleModels.alterArticle(
        articleId,
        updateUser,
        articleData
      );

      res.status(201).json(resultUpdate);
    } catch (e) {
      res.status(500).json({
        code: 500,
        message: `Erro interno, por favor tente mas tarde`,
        description: `${e}`,
      });
    }
  }

  /**metodo para deletar um artigo */
  static async apiDeleteArticle(req, res) {
    try {
      const articleId = req.params.articleId;

      const resultDelete = await ArticleModels.deleteArticle(articleId);

      if (resultDelete.sucess) {
        res.status(204).send();
      } else {
        res.status(404).json({
          code: 404,
          message: resultDelete.error,
          description: resultDelete.description,
        });
      }
    } catch (e) {
      res.status(500).json({
        code: 500,
        message: `Erro interno, por favor tente mas tarde`,
        description: `${e}`,
      });
    }
  }
}

module.exports = ArticleController;

// https://dev.weebly.com/pf_api_blog_posts.html

// {
//   'article_title': 'Teste de postagem'
//   "article_body":"LOrem ipsum",
//   "post_author":
//   "post_created_date":
// }
