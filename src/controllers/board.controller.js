import { checkuser } from "../helpers/checkuser.js";
import { Create,getAll,getOne } from "../helpers/crud.js";
import classController from "./class.controller.js";


export class boardController extends classController{
    constructor(){
        super("boards", "id", "boardId")
    }
    create = async (req, res, next)=>{
            try{
                const data = req.body
                const user_id = await checkuser()
                const result = await Create({...data, user_id}, this.table)
                res.status(201).json(result)
            }catch(err){
                next(err)
            }
    }
    GetOne = async (req, res, next)=>{
            try{
                const id = req.params[this.paramsId]
    
                const result = await getOne(id, this.table, this.buildWhere(req))
                if (!result) return res.status(404).json({ message: `${this.table.slice(0, -1)} not found`})
                
                const columns = await getAll("columns", { board_id: id })
                result.columns = columns.data

                res.status(200).json(result)
            }catch(err){
                next(err)
            }
        }
    GetAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    
    const searchColumns = ["title"];

    const boardsData = await getAll(
      this.table,
      this.buildWhere(req),
      page,
      limit,
      search,
      searchColumns
    );
    const boards = boardsData.data;

    if (!boards || boards.length === 0) {
      return res.status(404).json({
        message: `${this.table.slice(0, -1)} not found`,
        ...boardsData
      });
    }

    
    const boardsWithColumns = await Promise.all(
      boards.map(async (board) => {
        const columns = await getAll("columns", { board_id: board.id });
        board.columns = columns.data;
        return board;
      })
    );

    res.status(200).json({
      page: boardsData.page,
      limit: boardsData.limit,
      total: boardsData.total,
      totalPages: boardsData.totalPages,
      data: boardsWithColumns
    });
  } catch (err) {
    next(err);
  }
};

}