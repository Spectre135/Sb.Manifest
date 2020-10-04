using System;

namespace sb.manifest.api.SQL
{
    public class SQLBuilder
    {

        #region Customers
        public static string GetCustomersListSQL()
        {
            return "SELECT * FROM v_customer";
        }
        public static string GetInsertCustomerSQL()
        {
            return @"INSERT INTO Customer(FirstName,LastName,Email,IdCountry) 
                                      VALUES(@FirstName,@LastName,@Email,@IdCountry)";
        }
        public static string GetSaveCustomerSQL()
        {
            return @"UPDATE Customer set FirstName = @FirstName, LastName = @LastName, Email=@Email, IdCountry=@IdCountry WHERE Id = @Id";
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
            return @"INSERT INTO post(
                      IdTransaction, Account, IdCompany, 
                      IdCustomer, IdLoad, Description, 
                      Debit, Credit
                    ) --Odpremo terjatev do kupca konto 120/760 
                    SELECT 
                      (@IdTransaction || pl.IdCustomer), 
                      acc1.DAccount, 
                      1, 
                      pl.IdCustomer, 
                      pl.IdLoad, 
                      ps.Name Details, 
                      ps.Income, 
                      ps.Outcome 
                    FROM 
                      PassengerLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN TAccount acc1 ON acc1.Id = ps.IdAccount 
                      AND acc1.DAccount IS NOT NULL 
                    where 
                      IdLoad = @IdLoad 
                    UNION 
                    SELECT 
                      (@IdTransaction || pl.IdCustomer), 
                      acc1.CAccount, 
                      1, 
                      pl.IdCustomer, 
                      pl.IdLoad, 
                      ps.Name Details, 
                      ps.Outcome, 
                      ps.Income 
                    FROM 
                      PassengerLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN TAccount acc1 ON acc1.Id = ps.IdAccount 
                      AND acc1.CAccount IS NOT NULL 
                    where 
                      IdLoad = @IdLoad 
                    UNION 
                      --V primeru da kupec ima sredstva na kontu 230 potem poplačamo terjatev iz teh sredstev
                    SELECT 
                      (@IdTransaction || pl.IdCustomer), 
                      acc.DAccount Account, 
                      1, 
                      pl.IdCustomer, 
                      pl.IdLoad, 
                      ps.Name Details, 
                      ps.Income, 
                      ps.Outcome 
                    FROM 
                      PassengerLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN v_customer c ON c.Id = pl.IdCustomer 
                      INNER JOIN TAccount acc ON acc.DAccount in (230) 
                    WHERE 
                      c.Balance > 0 
                      AND pl.IdLoad = @IdLoad 
                    UNION 
                    SELECT 
                      (@IdTransaction || pl.IdCustomer), 
                      acc.CAccount Account, 
                      1, 
                      pl.IdCustomer, 
                      pl.IdLoad, 
                      ps.Name Details, 
                      ps.Outcome, 
                      ps.Income 
                    FROM 
                      PassengerLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN v_customer c ON c.Id = pl.IdCustomer 
                      INNER JOIN TAccount acc ON acc.DAccount in (230) 
                    WHERE 
                      c.Balance > 0 
                      AND pl.IdLoad = @IdLoad";
        }
        #endregion

        #region Invoice
        public static string GetInvoiceSQL()
        {
            return @"WITH 
                        IdTr(IdTransaction,Account) AS (
                        select IdTransaction,Account
                        from v_post 
                        where idCustomer = @IdCustomer
                        and Account in (120) 
                        group by IdTransaction
                        having SUM(Credit-Debit) < 0 )
                    SELECT p.IdTransaction,p.Account, p.IdCustomer, p.Customer, p.Description, (p.Debit - p.Credit) Amount,p.Date,l.Id IdLoad,l.Number LoadNo, a.Registration Aircraft
                    FROM v_post p
                    INNER JOIN IdTr ON IdTr.IdTransaction = p.IdTransaction AND IdTr.Account = p.Account
                    LEFT JOIN Load l ON l.Id = p.IdLoad
                    LEFT JOIN Aircraft a ON a.Id = l.IdAircraft";
        }
        public static string InsertPostPayInvoiceSQL()
        {
            return @"INSERT INTO post(IdTransaction, Account, IdCompany, IdCustomer, IdLoad, Description, Debit, Credit)
                            VALUES(@IdTransaction, @Account, @IdCompany, @IdCustomer, @IdLoad, @Description, @Debit, @Credit)";
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
            return @"INSERT INTO ProductSlot(IdProduct,Name,Description,Income,Outcome,IdAccount) 
                                      VALUES(@IdProduct,@Name, @Description, @Income,@Outcome, @IdAccount)";
        }
        public static string GetSaveProductSlotSQL()
        {
            return @"UPDATE ProductSlot set Name = @Name, Description = @Description, Income = @Income, Outcome = @Outcome, IdAccount= @IdAccount, IdProduct= @IdProduct WHERE Id = @Id";
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
            //TODO view
            return "SELECT * FROM TAccount where hidden=0";
        }
        #endregion

        #region Countries
        public static string GetCountriesSQL()
        {
            return "SELECT * FROM Countries";
        }
        #endregion

    }
}
