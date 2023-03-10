function returner(db,sql){
  return new Promise((resolve,reject)=>{
    db.query(sql,(err,data)=>{
      if(err)
        reject(err);
      else
        resolve(data);
    })
  })
}


export function createStreamDeleter({db,streamFileName,lineTermination }){
  if(lineTermination.match(/\n/))
    lineTermination = '\\n';
  else if(lineTermination.match(/\t/))
    lineTermination = '\\t';

  let sql = `
  CREATE EVENT streamDeleter ON SCHEDULE EVERY 2 MINUTE
  DO
  BEGIN
    SELECT name FROM Stream WHERE UNIX_TIMESTAMP() - LastTime > 120;
    SELECT FOUND_ROWS() INTO @numberSelected;

    IF @numberSelected > 0 THEN
    SELECT name FROM Stream WHERE UNIX_TIMESTAMP() - LastTime > 120 INTO OUTFILE '${streamFileName}' LINES TERMINATED BY '${lineTermination}';
    DELETE FROM stream WHERE UNIX_TIMESTAMP() - LastTime > 120;
    END IF;
  END
  `;

  return returner(db,sql);
}

export function createAddStreamHelper({db}){
  let sql = `
    CREATE PROCEDURE add_streams()                     
    BEGIN                                                                           
        SET @p = 0;                                                             
        label1: LOOP                                                            
                IF @p < 40 THEN                                                 
                        INSERT INTO stream(name) values(@p);                    
                        SET @p = @p +1;                                         
                        ITERATE label1;                                         
                ELSE                                                            
                        LEAVE label1;                                           
                END IF;                                                         
        END LOOP label1;                                                        
    END ;    
  `;

  return returner(db,sql);

}