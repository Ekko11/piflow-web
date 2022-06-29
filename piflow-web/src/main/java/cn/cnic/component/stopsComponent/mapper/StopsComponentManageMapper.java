package cn.cnic.component.stopsComponent.mapper;

import cn.cnic.component.stopsComponent.entity.StopsComponentManage;
import cn.cnic.component.stopsComponent.mapper.provider.StopsComponentManageMapperProvider;
import org.apache.ibatis.annotations.*;

@Mapper
public interface StopsComponentManageMapper {



    /**
     * Add stopsComponentManage.
     *
     * @param stopsComponentManage
     * @return
     */
    @InsertProvider(type = StopsComponentManageMapperProvider.class, method = "insertStopsComponentManage")
    public int insertStopsComponentManage(StopsComponentManage stopsComponentManage);
    
    /**
     * update StopsComponentManage.
     *
     * @param stopsComponentManage
     * @return
     */
    @InsertProvider(type = StopsComponentManageMapperProvider.class, method = "updateStopsComponentManage")
    public int updateStopsComponentManage(StopsComponentManage stopsComponentManage);

    /**
     * Query StopsComponentManage by bundle and stopsGroups
     *
     * @param bundle
     * @param stopsGroups
     * @return StopsComponentManage
     */
    @SelectProvider(type = StopsComponentManageMapperProvider.class, method = "getStopsComponentManageByBundleAndGroup")
    public StopsComponentManage getStopsComponentManageByBundleAndGroup(String bundle, String stopsGroups);

}
