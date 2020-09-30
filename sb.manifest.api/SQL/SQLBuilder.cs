namespace sb.manifest.api.SQL
{
    public class SQLBuilder
    {
        #region Customers
        public static string GetCustomersListSQL()
        {
            return "SELECT * FROM v_customer";
        }
        #endregion

        #region Load
        public static string GetInsertPassengersToLoadSQL()
        {
            return "INSERT INTO PassengerLoad VALUES(@IdPeople,@IdLoad,@IdProductSlot,datetime('now'))";
        }
        public static string GetLoadListSQL()
        {
            return "SELECT * FROM v_load";
        }
        public static string GetConfirmLoadSQL()
        {
            return @"UPDATE Load set Status = @Status WHERE Id = @Id;";
        }
        #endregion

        #region Post
        public static string GetPostListSQL()
        {
            return "SELECT * FROM v_post";
        }
        public static string InsertPostLoadConfirmSQL()
        {
            return @"INSERT INTO post(IdTransaction, Account, XAccount, IdCompany, IdCustomer, IdLoad, Description, Debit, Credit)
                        SELECT (@IdTransaction || pl.IdCustomer), ps.Account,null, @IdCompany, pl.IdCustomer, pl.IdLoad, ps.Name Details, ps.Income, ps.Outcome
                        FROM PassengerLoad pl
                        INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot
                        where IdLoad = @IdLoad 
                        UNION
                        SELECT (@IdTransaction || pl.IdCustomer), null,acc.XAccount, @IdCompany, pl.IdCustomer, pl.IdLoad, ps.Name Details,ps.Outcome, ps.Income
                        FROM PassengerLoad pl
                        INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot
                        INNER JOIN TAccount acc ON acc.Account = ps.Account and acc.Account=110004
                        Where pl.IdLoad = @IdLoad";
        }
        #endregion

        #region Invoice
        public static string GetInvoiceSQL()
        {
            return @"select IdCustomer, Customer, Description, Sum(Debit)-Sum(Credit) Amount,count(*) Qty
                     from v_post where idCustomer = @IdCustomer
                     group by Description";
        }
        #endregion

        #region Product
        public static string GetSalesProductSQL()
        {
            return "SELECT * FROM Product order by id";
        }
        public static string GetInsertSalesProductSQL()
        {
            return @"INSERT INTO Product(Name,Description) VALUES(@Name, @Description)";
        }
        public static string GetSaveSalesProductSQL()
        {
            return @"UPDATE Product set Name = @Name, Description = @Description WHERE Id = @Id;";
        }
        #endregion

        #region ProductSlot
        public static string GetProductSlotSQL()
        {
            return "SELECT * FROM V_ProductSlot";
        }
        public static string GetInsertProductSlotSQL()
        {
            return @"INSERT INTO ProductSlot(IdProduct,Name,Description,Income,Outcome,Account) 
                                      VALUES(@IdProduct,@Name, @Description, @Income,@Outcome, @Account)";
        }
        public static string GetSaveProductSlotSQL()
        {
            return @"UPDATE ProductSlot set Name = @Name, Description = @Description, Income = @Income, Outcome = @Outcome, Account= @Account, IdProduct= @IdProduct WHERE Id = @Id";
        }
        #endregion

        #region Aircraft
        public static string GetAircraftSQL()
        {
            return "SELECT * FROM Aircraft";
        }
        public static string GetInsertAircraftSQL()
        {
            return @"INSERT INTO Aircraft(Registration,Type,MaxSlots,MinSlots,RotationTime,Active) 
                                      VALUES(upper(@Registration),@Type,@MaxSlots,@MinSlots,@RotationTime,@Active)";
        }
        public static string GetSaveAircraftSQL()
        {
            return @"UPDATE Aircraft set 
                                    Registration = upper(@Registration), 
                                    Type = @Type, 
                                    MaxSlots = @MaxSlots,
                                    MinSlots = @MinSlots, 
                                    RotationTime= @RotationTime, 
                                    Active = @Active 
                    WHERE Id = @Id";
        }
        #endregion

        #region Accounts
        public static string GetAccountsSQL()
        {
            return "SELECT * FROM TAccount";
        }
        #endregion

    }
}
