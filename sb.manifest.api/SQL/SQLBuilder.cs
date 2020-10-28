using System;

namespace sb.manifest.api.SQL
{
    public class SQLBuilder
    {

        #region Customers
        public static string GetCustomersListSQL()
        {
            return "SELECT * FROM v_customer WHERE 1=1 "; //WHERE 1=1 ker dodajamo pogoje za search
        }
        public static string GetInsertCustomerSQL()
        {
            return @"INSERT INTO customer 
                                (firstname, 
                                 lastname, 
                                 email, 
                                 birthdate, 
                                 address, 
                                 postalcode, 
                                 idcountry, 
                                 phone,
                                 weight,
                                 [limit],
                                 ticketprice) 
                    VALUES     (@FirstName, 
                                @LastName, 
                                @Email, 
                                Date(@BirthDate), 
                                @Address, 
                                @PostalCode, 
                                @IdCountry, 
                                @Phone,
                                @Weight,
                                @Limit,
                                @TicketPrice) ";
        }
        public static string GetSaveCustomerSQL()
        {
            return @"UPDATE customer 
                     SET    firstname = @FirstName, 
                            lastname = @LastName, 
                            birthdate = Date(@BirthDate), 
                            email = @Email, 
                            address = @Address, 
                            postalcode = @PostalCode, 
                            idcountry = @IdCountry, 
                            phone = @Phone,
                            weight = @Weight,
                            [limit] = @Limit,
                            ticketprice = @TicketPrice
                     WHERE  id = @Id ";
        }
        #endregion

        #region Load
        public static string GetInsertLoadSQL()
        {
            return @"INSERT INTO Load(Number,Description,IdAircraft) 
                                      VALUES(@Number,@Description,@IdAircraft)";
        }
        public static string GetSaveLoadSQL()
        {
            return @"UPDATE Load set 
                                    Description = @Description, 
                                    IdAircraft = @IdAircraft, 
                                    Number = @Number
                    WHERE Id = @Id";
        }
        public static string GetInsertPassengersToLoadSQL()
        {
            return "INSERT INTO OnLoad(IdCustomer,IdLoad,IdProductSlot,IdGroup) VALUES(@IdCustomer,@IdLoad,@IdProductSlot,@IdGroup)";
        }
        public static string GetLoadListSQL()
        {
            return "SELECT * FROM v_loadlist WHERE Status=0 ";
        }
        public static string GetLoadsHistoryByCustomerSQL()
        {
            return "SELECT * FROM v_loadlist WHERE IdCustomer = @IdCustomer";
        }
        public static string GetLoadSQL()
        {
            return "SELECT * FROM v_load WHERE 1=1 ";
        }
        public static string GetConfirmLoadSQL()
        {
            return @"UPDATE Load set Status = @Status WHERE Id = @Id";
        }
        public static string GetActiveTodaySQL()
        {
            return @"WITH today as (
                    select c.Id,l.IdLoad 
                    from OnLoad l
                    inner join customer c on c.id=l.IdCustomer
                    where l.date > date('now')
                    )
                    SELECT c.id, 
                           c.firstname 
                           || ' ' 
                           || c.lastname Name, 
                           CASE 
                             WHEN l.idload IS NULL THEN 0 
                             ELSE 1 
                           end           OnBoard,
                           at.AvaibleTickets-til.Tickets AvaibleTickets,
                           at.ProductName TicketName,
                           at.IdProductSlot,
                           IFNULL(c.[Limit],0) + c.Balance AvaibleFunds,
                           c.IsStaff
                    FROM   v_customer c 
                           INNER JOIN today t ON t.Id = c.Id 
                           LEFT JOIN onload l ON c.id = l.idcustomer  AND l.idload = @IdLoad
                           LEFT JOIN V_AvaibleTickets at ON at.IdCustomer = c.Id 
                           LEFT JOIN V_OpenTickets til ON til.IdCustomer = c.Id
                    GROUP  BY c.id, 
                              c.firstname, 
                              c.lastname, 
                              l.idload,
                              c.IsStaff";
        }
        public static string GetActiveSQL()
        {
            return @"SELECT c.id, 
                           l.IdLoad,
                           c.firstname 
                           || ' ' 
                           || c.lastname Name, 
                           CASE 
                             WHEN l.idload IS NULL THEN 0 
                             ELSE 1 
                           end           OnBoard,
                           at.AvaibleTickets-til.Tickets AvaibleTickets,
                           at.ProductName TicketName,
                           at.IdProductSlot,
                           IFNULL(c.[Limit],0) + c.Balance AvaibleFunds,
                           c.IsStaff
                    FROM   v_customer c 
                           LEFT JOIN onload l 
                                  ON c.id = l.idcustomer 
                                     AND l.idload = @IdLoad
                           LEFT JOIN V_AvaibleTICKETS at ON at.IdCustomer = c.Id  
                           LEFT JOIN V_OpenTickets til ON til.IdCustomer = c.Id
                           WHERE (c.firstname || ' ' || c.lastname) like @Name
                    GROUP  BY c.id, 
                              c.firstname, 
                              c.lastname, 
                              l.idload,
                              c.IsStaff
                    LIMIT @Limit";
        }
        public static string GetMoveSlotSQL()
        {
            return @"UPDATE OnLoad set IdLoad = @IdLoadTo,Date=datetime('now', 'localtime') WHERE IdCustomer = @IdCustomer AND IdLoad = @IdLoadFrom";
        }
        #endregion

        #region Post
        public static string GetPostListSQL()
        {
            return "SELECT * FROM v_post WHERE 1=1 "; //WHERE 1=1 ker dodajamo pogoje za search
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
                      OnLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN TAccount acc1 ON acc1.Id = ps.IdAccount AND acc1.DAccount IS NOT NULL 
                      LEFT JOIN v_Avaibletickets at ON at.IdCustomer = pl.IdCustomer AND at.IdProductSlot = pl.IdProductSlot 
                    WHERE 
                      IdLoad = @IdLoad 
                    AND at.AvaibleTickets is null
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
                      OnLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN TAccount acc1 ON acc1.Id = ps.IdAccount AND acc1.CAccount IS NOT NULL 
                      LEFT JOIN v_Avaibletickets at ON at.IdCustomer = pl.IdCustomer AND at.IdProductSlot = pl.IdProductSlot 
                    WHERE 
                      IdLoad = @IdLoad 
                    AND at.AvaibleTickets is null
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
                      OnLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN v_customer c ON c.Id = pl.IdCustomer 
                      INNER JOIN TAccount acc ON acc.DAccount in (230) 
                      LEFT JOIN v_Avaibletickets at ON at.IdCustomer = pl.IdCustomer AND at.IdProductSlot = pl.IdProductSlot 
                    WHERE 
                      c.Balance > 0 
                      AND pl.IdLoad = @IdLoad 
                      AND at.AvaibleTickets is null
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
                      OnLoad pl 
                      INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                      INNER JOIN v_customer c ON c.Id = pl.IdCustomer 
                      INNER JOIN TAccount acc ON acc.DAccount in (230) 
                      LEFT JOIN v_Avaibletickets at ON at.IdCustomer = pl.IdCustomer AND at.IdProductSlot = pl.IdProductSlot 
                    WHERE 
                      c.Balance > 0 
                      AND at.AvaibleTickets is null
                      AND pl.IdLoad = @IdLoad";
        }
        public static string InsertPostBuyTransactionSQL()
        {
            return @"INSERT INTO post 
                                    (idtransaction, 
                                     account, 
                                     idcompany, 
                                     idcustomer, 
                                     description, 
                                     debit, 
                                     credit) --Odpremo terjatev do kupca konto 120/760   
                        SELECT ( @IdTransaction 
                                 || @IdCustomer ), 
                               120, 
                               1, 
                               @IdCustomer, 
                               @Details, 
                               @Price  Income, 
                               0       Outcome 
                        UNION ALL
                        SELECT ( @IdTransaction 
                                 || @IdCustomer ), 
                               760, 
                               1, 
                               @IdCustomer, 
                               @Details, 
                               0   Income, 
                               @Price Outcome
                        -- Zapremo transakcijo s plačilom
                        UNION ALL
                        SELECT ( @IdTransaction 
                                 || @IdCustomer ), 
                               acc1.caccount, 
                               1, 
                               @IdCustomer, 
                               @Details, 
                               0  Income,            
                               @Price Outcome
                        FROM   taccount acc1 
                        WHERE  acc1.id = @IdPayMethod 
                        UNION ALL
                        SELECT ( @IdTransaction 
                                 || @IdCustomer ), 
                               acc1.daccount, 
                               1, 
                               @IdCustomer, 
                               @Details, 
                               @Price Income,
                               0  Outcome
                        FROM   taccount acc1 
                        WHERE acc1.id = @IdPayMethod ";
        }
        #endregion

        #region TicketPost
        public static string InsertCreditTicketsSQL()
        {
            return @"INSERT INTO TicketPost(IdCustomer,IdProductSlot,IdTransaction, CTickets)
                    Select 
                    @IdCustomer,
                    p.Id IdProductSlot,
                    @IdTransaction,
                    @Quantity CTickets
                    from ProductSlot p 
                    where p.Id = @IdProduct";
        }
        public static string DebitTicketSQL()
        {
            return @"INSERT INTO TicketPost(IdCustomer,IdProductSlot,IdLoad, DTickets)
                    Select 
                    pl.IdCustomer,
                    ps.Id,
                    pl.IdLoad,
                    1 DTickets
                    FROM OnLoad pl 
                    INNER JOIN ProductSlot ps ON ps.Id = pl.IdProductSlot 
                    INNER JOIN v_Avaibletickets t ON t.IdCustomer = pl.IdCustomer                  
                    where pl.IdLoad = @IdLoad";
        }
        public static string GetTicketPostListSQL()
        {
            return "SELECT * FROM v_ticketpost WHERE IdCustomer = @IdCustomer "; 
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
            return @"INSERT INTO product 
                                (name, 
                                 description, 
                                 backgroundcolor, 
                                 isproductslot, 
                                 price) 
                    VALUES     (@Name, 
                                @Description, 
                                @BackgroundColor, 
                                @IsProductSlot, 
                                @Price)";
        }
        public static string GetSaveSalesProductSQL()
        {
            return @"UPDATE product 
                     SET    name = @Name, 
                            description = @Description, 
                            backgroundcolor = @BackgroundColor, 
                            isproductslot = @IsProductSlot, 
                            price = @Price
                     WHERE  id = @Id ";
        }
        #endregion

        #region ProductSlot
        public static string GetProductSlotSQL()
        {
            return "SELECT * FROM V_ProductSlot";
        }
        public static string GetInsertProductSlotSQL()
        {
            return @"INSERT INTO ProductSlot(IdProduct,Name,Description,Income,Outcome,IdAccount,IsStaffJob,EquipmentWeight) 
                                      VALUES(@IdProduct,@Name, @Description, @Income,@Outcome, @IdAccount,@IsStaffJob,@EquipmentWeight)";
        }
        public static string GetSaveProductSlotSQL()
        {
            return @"UPDATE productslot 
                        SET    NAME = @Name, 
                               description = @Description, 
                               income = @Income, 
                               outcome = @Outcome, 
                               idaccount = @IdAccount, 
                               idproduct = @IdProduct, 
                               isstaffjob = @IsStaffJob,
                               equipmentweight = @EquipmentWeight
                        WHERE  id = @Id ";
        }
        #endregion

        #region Aircraft
        public static string GetAircraftSQL()
        {
            return "SELECT * FROM Aircraft";
        }
        public static string GetInsertAircraftSQL()
        {
            return @"INSERT INTO Aircraft(Registration,Type,Name,MaxSlots,MinSlots,RotationTime,Active) 
                                      VALUES(upper(@Registration),@Type,@Name,@MaxSlots,@MinSlots,@RotationTime,@Active)";
        }
        public static string GetSaveAircraftSQL()
        {
            return @"UPDATE Aircraft set 
                                    Registration = upper(@Registration), 
                                    Type = @Type, 
                                    Name = @Name,
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
            return @"SELECT * FROM Countries";
        }
        #endregion

        #region Dashboard
        public static string GetDashboardProductListSQL()
        {
            return @"SELECT * FROM V_DashboardProduct";
        }
        #endregion

        #region PayMethod
        public static string GetPayMethodSQL()
        {
            return @"SELECT * FROM TAccount where IsPayMethod=1";
        }
        #endregion

    }
}
