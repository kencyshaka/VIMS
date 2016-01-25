package org.openlmis.vaccine.repository.mapper;

import org.apache.ibatis.annotations.*;
import org.openlmis.core.domain.Product;
import org.openlmis.vaccine.dto.StockRequirements_;
import org.openlmis.vaccine.dto.StockRequirements;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRequirementsMapper {

    @Select("SELECT p.primaryName as productName, sr.* " +
            " FROM stock_requirements sr join products p on p.id=sr.productid WHERE sr.programid=#{programId} AND sr.facilityid=#{facilityId} AND sr.year=#{year}" +
            " order by sr.productId")
    List<StockRequirements_> getAllByProgramAndFacility(@Param("programId")Long programId, @Param("facilityId") Long facilityId,@Param("year")int year);

    @Select("SELECT *" +
            " FROM stock_requirements " +
            " WHERE id=#{id}")
    StockRequirements getById(Long id);

    @Select("SELECT *" +
            " FROM stock_requirements " +
            " WHERE  facilityid=#{facilityId} AND programid=#{programId} AND productid=#{productId} AND year=#{year}")
    StockRequirements_ getByProductId(@Param("programId") Long programId,@Param("facilityId") Long facilityId,@Param("productId")Long productId,@Param("year")int year);



    @Update("update stock_requirements " +
            " set " +
            " annualneed = #{annualNeed}," +
            " supplyperiodneed= #{supplyPeriodNeed}, " +
            " isavalue = #{isaValue}," +
            " reorderlevel = #{reorderLevel}, " +
            " bufferstock = #{bufferStock}, " +
            " maximumstock = #{maximumStock}," +
            " modifieddate= NOW() "+
            "WHERE id=#{id} "
    )
    Integer update(StockRequirements_ requirements);



    @Insert("insert into stock_requirements  " +
            " (programid, facilityid, productid,productcategory,year, annualneed, supplyperiodneed, isavalue,reorderlevel,bufferstock," +
            "  maximumstock,createdby,createddate,modifiedby,modifieddate) " +
            " values " +
            " (#{programId}, #{facilityId},#{productId},#{productCategory},#{year}, #{annualNeed}, #{supplyPeriodNeed},#{isaValue},#{reorderLevel},#{bufferStock},#{maximumStock}," +
            " #{createdBy},NOW(),#{modifiedBy},NOW()) ")
    @Options(useGeneratedKeys = true)
    Integer save(StockRequirements stockRequirements);


    @Delete("Delete from stock_requirements where programid=#{programId} and facilityid=#{facilityId} and year=#{year}")
    Integer deleteFacilityStockRequirements(@Param("programId")Long programId,@Param("facilityId")Long facilityId,@Param("year")int year);

}
