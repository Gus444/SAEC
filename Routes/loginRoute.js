import express from 'express';
import LoginController from '../Controllers/loginController.js'

let router = express.Router();

let ctrl = new LoginController()
router.post('/', (req, res) => {

    // #swagger.tags = ['Login']
    // #swagger.summary = "Gerar token de acesso"
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/loginModel"
                }
            }
            
        }
    }*/
    ctrl.autenticar(req, res);
});
router.get('/logout',(req,res) => {
    // #swagger.tags = ['Login']
    // #swagger.summary = "Limpar token/Deslogar"
    ctrl.logout(req,res)
})

export default router;