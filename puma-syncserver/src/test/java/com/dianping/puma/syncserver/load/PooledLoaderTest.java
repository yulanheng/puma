package com.dianping.puma.syncserver.load;

import com.dianping.puma.core.event.RowChangedEvent;
import com.dianping.puma.core.event.RowChangedEvent.ColumnInfo;
import com.dianping.puma.core.util.sql.DMLType;
import com.dianping.puma.syncserver.job.BinlogInfoManager;
import com.dianping.puma.syncserver.job.load.PooledLoader;

import java.util.HashMap;
import java.util.Map;

public class PooledLoaderTest {

	public static void main(String[] args) {
		PooledLoader loader = new PooledLoader("192.168.224.102:3306", "root", "123456", new BinlogInfoManager());

		loader.start();
		RowChangedEvent row = new RowChangedEvent();
		row.setDmlType(DMLType.UPDATE);
		row.setDatabase("Pressure");
		row.setTable("user");
		Map<String, ColumnInfo> columnInfoMap = new HashMap<String, ColumnInfo>();
		columnInfoMap.put("id", new ColumnInfo(true, 200, 200));
		columnInfoMap.put("name", new ColumnInfo(false, "jjj", "iii"));
		row.setColumns(columnInfoMap);

		loader.load(row);

		row.setDmlType(DMLType.UPDATE);
		row.setDatabase("Pressure");
		row.setTable("user");
		columnInfoMap = new HashMap<String, ColumnInfo>();
		columnInfoMap.put("id", new ColumnInfo(true, 200, 200));
		columnInfoMap.put("name", new ColumnInfo(false, "iii", "mmm"));
		row.setColumns(columnInfoMap);

		loader.load(row);
	}
}