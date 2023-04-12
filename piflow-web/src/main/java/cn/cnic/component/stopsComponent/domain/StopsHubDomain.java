package cn.cnic.component.stopsComponent.domain;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import cn.cnic.component.stopsComponent.entity.StopsHub;
import cn.cnic.component.stopsComponent.mapper.StopsHubMapper;

@Component
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT, timeout = 36000, rollbackFor = Exception.class)
public class StopsHubDomain {

    private final StopsHubMapper stopsHubMapper;

    @Autowired
    public StopsHubDomain(StopsHubMapper stopsHubMapper) {
        this.stopsHubMapper = stopsHubMapper;
    }

    /**
     * add StopsHub
     *
     * @param stopsHub
     * @return
     */
    public int addStopHub(StopsHub stopsHub) {
        return stopsHubMapper.addStopHub(stopsHub);
    }

    /**
     * update StopsHub
     *
     * @param stopsHub
     * @return
     */
    public int updateStopHub(StopsHub stopsHub) {
        return stopsHubMapper.updateStopHub(stopsHub);
    }

    /**
     * query all StopsHub
     *
     * @return
     */
    public List<StopsHub> getStopsHubList(String username, boolean isAdmin) {
        return stopsHubMapper.getStopsHubList(username, isAdmin);
    }

    public List<StopsHub> getStopsHubByName(String username, boolean isAdmin, String jarName) {
        return stopsHubMapper.getStopsHubByName(username, isAdmin, jarName);
    }

    public StopsHub getStopsHubById(String username, boolean isAdmin, String id) {
        return stopsHubMapper.getStopsHubById(username, isAdmin, id);
    }

    public int deleteStopsHubById(String username, String id) {
        return stopsHubMapper.deleteStopsHubById(username, id);
    }

    public List<StopsHub> getStopsHubListParam(String username, boolean isAdmin, String param) {
        return stopsHubMapper.getStopsHubListParam(username, isAdmin, param);
    }


    public List<StopsHub> getStopsHubByJarName(String username, boolean isAdmin, String jarName) {
        return stopsHubMapper.getStopsHubByJarName(username, isAdmin, jarName);
    }
}
